export const stringifyParams = ({
  params,
  withSymbol = true,
}: {
  params: Record<string, unknown>
  withSymbol?: boolean
}) => {
  const sp = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      sp.append(key, String(value))
    }
  })

  return withSymbol ? `?${sp.toString()}` : sp.toString()
}
