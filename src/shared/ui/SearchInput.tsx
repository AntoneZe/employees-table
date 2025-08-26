import { TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

type Props = {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  w?: number | string
}

export function SearchInput({ value, onChange, placeholder, w = 360 }: Props) {
  return (
    <TextInput
      leftSection={<IconSearch size={16} />}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder={placeholder ?? 'Search...'}
      w={w}
      radius="md"
      size="sm"
      variant="filled"
    />
  )
}