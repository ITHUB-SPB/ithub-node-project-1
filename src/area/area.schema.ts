import * as v from 'valibot';

const areaSchema = v.object({
    id: v.pipe(v.number(), v.integer(), v.minValue(1)),
    title: v.pipe(v.string(), v.nonEmpty())
})

export const areasSchema = v.array(areaSchema)

export const areasResponseSchema = v.strictObject({
    statusCode: v.literal(200),
    data: v.object({
        areas: areasSchema
        // TODO
    })
})

export type AreasSchema = v.InferOutput<typeof areasSchema>
export type AreasResponseSchema = v.InferOutput<typeof areasResponseSchema>

