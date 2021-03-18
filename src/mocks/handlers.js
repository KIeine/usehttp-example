import { rest } from 'msw'

export const handlers = [
    rest.get("/success", (req, res, ctx) =>
        res(
            ctx.status(200),
            ctx.json({
                message: 'This api request was successful.'
            })
        )
    ),
    rest.get("/not-authorized", (req, res, ctx) =>
        res(ctx.status(403))
    ),
    rest.get("/not-found", (req, res, ctx) =>
        res(ctx.status(404))
    ),
    rest.get("/server-error", (req, res, ctx) =>
        res(ctx.status(500))
    ),
]
