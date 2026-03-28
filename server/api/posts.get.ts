export default defineEventHandler((event) => {
  return prisma.post.findMany()
})
