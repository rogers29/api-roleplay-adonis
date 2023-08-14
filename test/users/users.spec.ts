import { UserFactory } from './../../database/factories/index'
import test from 'japa'
import supertest from 'supertest'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

let token = ''
let user = {} as User

/*
  {
    "users": {
      "email": string,
      "username": string,
      "password": string,
      "avatar": string
    }
  }
*/
test.group('User', (group) => {
  test('it should create an user', async (assert) => {
    const userPayload = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      avatar: 'https://images.com/image/1',
    }
    const { body } = await supertest(BASE_URL).post('/users').send(userPayload).expect(201)
    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')
    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.username, userPayload.username)
    assert.notExists(body.user.password, 'Password defined')
  })

  test('it should return 409 when email is already in use', async (assert) => {
    const { email } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'test',
        password: 'test',
      }).expect(409)

    assert.include(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('it should return 409 when username is already in use', async (assert) => {
    const { username } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'test@test.com',
        username,
        password: 'test',
      }).expect(409)

    assert.include(body.message, 'username')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL).post('/users').send({}).expect(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 422 when providing an invalid email', async (assert) => {
    const { body } = await supertest(BASE_URL).post('/users').send({
      email: 'test@',
      username: 'test',
      password: 'test',
    }).expect(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 422 when providing an invalid password', async (assert) => {
    const {body} = await supertest(BASE_URL).post('/users').send({
      email: 'test@test.com',
      username: 'test',
      password: 'tes',
    }).expect(422)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should update an user', async (assert) => {
    const email = 'test@test.com'
    const avatar = 'https://github.com/image.png'

    const { body } = await supertest(BASE_URL)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email,
        avatar,
        password: user.password,
      }).expect(200)

    assert.exists(body.user, 'User underfined')
    assert.equal(body.user.email, email)
    assert.equal(body.user.avatar, avatar)
    assert.equal(body.user.id, user.id)
  })

  test('it should update the password of the user', async (assert) => {
    const password = 'test'

    const { body } = await supertest(BASE_URL)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        email: user.email,
        avatar: user.avatar,
        password,
      }).expect(200)

    assert.exists(body.user, 'User underfined')
    assert.equal(body.user.id, user.id)

    await user.refresh()
    assert.isTrue(await Hash.verify(user.password, password))
  })

  test('it should return 422 wnhe required data is not provided', async (assert) => {
    const { id } = await UserFactory.create()

    const { body } = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(422)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 422 when provinding an invalid email', async (assert) => {
    const { id, password, avatar } = await UserFactory.create()

    const { body } = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        password,
        avatar,
        email: 'test@',
      }).expect(422)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 422 when provinding an invalid password', async (assert) => {
    const { id, email, avatar } = await UserFactory.create()

    const { body } = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: 'tes',
        avatar,
        email,
      }).expect(422)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should return 422 when provinding an invalid avatar', async (assert) => {
    const { id, password, email } = await UserFactory.create()

    const { body } = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        password,
        avatar: 'teste',
        email,
      }).expect(422)

    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  group.before(async () => {
    const plainPassword = 'test'
    const newUser = await UserFactory.merge({ password: plainPassword }).create()
    const { body } = await supertest(BASE_URL)
      .post('/sessions')
      .send({ email: newUser.email, password: plainPassword })
      .expect(201)

    token = body.token.token
    user = newUser
  })

  group.after(async () => {
    await supertest(BASE_URL)
      .delete('/sessions')
      .set('Authorization', `Bearer ${token}`)
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
