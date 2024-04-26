export default function setRef<T>(ref: React.ForwardedRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (typeof ref === 'object') {
    ref!.current = value
  }
}