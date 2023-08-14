import { UserFactory } from 'Database/factories'
import { test } from '@japa/runner'
import Mail from '@ioc:Adonis/Addons/Mail'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Password', (group) => {
  test('it should send and email with forgot password instructions', async ({ assert, client }) => {
    const user = await UserFactory.create()

    const mailer = Mail.fake()

    await client
      .post('/forgot-password')
      .json({
        email: user.email,
        resetPasswordUrl: 'url',
      })

    assert.isTrue(mailer.exists({ to: [{ address: user.email }] }))
    assert.isTrue(mailer.exists({ from: { address: 'no-reply@roleplay.com' } }))
    assert.isTrue(mailer.exists({ subject: 'Roleplay: Recuperação de Senha' }))
    assert.isTrue(mailer.exists((mail) => mail.html!.includes(user.username)))

    Mail.restore()
  })
})
