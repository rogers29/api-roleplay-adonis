import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

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
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an user', async ({ client, assert }) => {
    const userPayload = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      avatar: 'https://images.com/image/1',
    }
    const response = await client.post('/users').json(userPayload)

    const { password, avatar, ...expected } = userPayload

    response.assertStatus(201)
    response.assertBodyContains({ user: expected })
    assert.notExists(response.body().user.password, 'Password defined')
  })

  test('it should update an user', async ({ client }) => {
    const user = await UserFactory.create()
    const email = 'test@test.com'
    const avatar = 'https://github.com/image.png'

    const response = await client
      .put(`/users/${user.id}`)
      .json({
        email,
        avatar,
        password: user.password,
      })
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        email,
        avatar,
        id: user.id,
      },
    })
  })
})
