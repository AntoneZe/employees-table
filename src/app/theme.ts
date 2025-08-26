import { createTheme, type MantineColorsTuple } from '@mantine/core'

const gray: MantineColorsTuple = [
  '#f6f7f8','#eceff1','#dbe1e6','#c5ced6','#b3bfcc',
  '#a6b5c7','#9eafc4','#8da0b6','#7f90a6','#6a7b90',
]

export const theme = createTheme({
  primaryColor: 'gray',          
  primaryShade: 6,
  colors: { gray },
  fontFamily: 'Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  headings: { fontFamily: 'Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif' },
  defaultRadius: 'lg',           
  components: {
    Button: { defaultProps: { size: 'sm', radius: 'md' } },
    TextInput: { defaultProps: { size: 'sm', radius: 'md', variant: 'filled' } },
    Select: { defaultProps: { size: 'sm', radius: 'md', variant: 'filled' } },
    Container: { defaultProps: { fluid: true } },
  },
})