import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import Group from 'App/Models/Group'
import CreateGroup from 'App/Validators/CreateGroupValidator'

export default class GroupsController {
  // Index é o nome padrão de método que o Adonis utiliza quando é retornado uma listagem de dados.
  public async index ({ request, response }: HttpContextContract) {
    // Para pegar parametros passados na URl é utilizado o "qs"
    const { text, ['user']: userId } = request.qs()

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    const groupsQuery = this.filterByQueryString(userId, text)
    const groups = await groupsQuery.paginate(page, limit)

    return response.ok({groups})

    // O "as any" é para corrigir um erro do typescript
    // que iria acusar que "groups" nunca seria lido dentro dos Ifs/Else
    // let groups = [] as any
  }

  public async store ({ request, response}: HttpContextContract) {
    const groupPayload = await request.validate(CreateGroup)
    const group = await Group.create(groupPayload)

    await group.related('players').attach([groupPayload.master])
    await group.load('players')

    return response.created({ group })
  }

  public async update ({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('id')
    const payload = request.all()
    const group = await Group.findOrFail(id)

    await bouncer.authorize('updateGroup', group)

    const updatedGroup = await group.merge(payload).save()

    return response.ok({ group : updatedGroup })
  }

  public async removePlayer ({ request, response }: HttpContextContract) {
    const groupId = request.param('groupId') as number

    // O simbolo "+" na request é para indicar que será um tipo number e o cache deve ser carregado como number.
    const playerId = +request.param('playerId')

    const group = await Group.findOrFail(groupId)

    if (playerId === group.master) {
      throw new BadRequest('cannot remove master from group', 400)
    }
    await group.related('players').detach([playerId])

    return response.ok({})
  }

  public async destroy ({ request, response, bouncer }: HttpContextContract) {
    const id = request.param('id')
    const group = await Group.findOrFail(id)

    await bouncer.authorize('deleteGroup', group)

    await group.delete()

    // Formas de remover um relacionamento
    // await group.related('players').detach()
    // Essa não é a melhor forma  a melhro forma é utilizando  'CASCADE' direto na migration

    return response.ok({})
  }

  private filterByQueryString (userId: number, text: string) {
    if (userId && text) {
      return this.filterByUserAndText(userId, text)
    } else if (userId) {
      return this.filterByUser(userId)
    } else if (text) {
      return this.filterByText(text)
    } else {
      return this.all()
    }
  }

  private all () {
    return Group.query().preload('players').preload('masterUser')
  }

  private filterByUser (userId: number) {
    return Group.query()
      .preload('players')
      .preload('masterUser')
      .withScopes((scope) => scope.withPlayer(userId))
  }

  private filterByText (text: string) {
    return Group.query()
      .preload('players')
      .preload('masterUser')
      .withScopes((scope) => scope.withText(text))
  }

  private filterByUserAndText (userId: number, text: string) {
    return Group.query()
      .preload('players')
      .preload('masterUser')
      .withScopes((scope) => scope.withPlayer(userId))
      .withScopes((scope) => scope.withText(text))
  }
}
