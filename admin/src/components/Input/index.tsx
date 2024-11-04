import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'


import {
  Box,
  Field,
  FieldAction,
  FieldError,
  FieldHint,
  FieldLabel,
  Stack,
  Flex,
  ComboboxOption,
  Combobox
} from '@strapi/design-system';
import axios from 'axios';

interface CFAttribute {
  customField: string;
  options: {
    apiUrl: string;
    authToken: string;
  }
  type: string;
}

interface IOption {
  id: string;
  name: string;
}

export const FieldActionWrapper = styled(FieldAction)`
  svg {
    height: 1rem;
    width: 1rem;
    path {
      fill: ${({ theme }) => theme.colors.neutral400};
    }
  }

  svg:hover {
    path {
      fill: ${({ theme }) => theme.colors.primary600};
    }
  }
`

const Input = ({
  attribute,
  description,
  placeholder,
  disabled,
  error,
  intlLabel,
  labelAction,
  name,
  onChange,
  value: initialValue = "",
  ...props
}: {
  attribute: CFAttribute
  description: any
  placeholder: string
  disabled: boolean
  error: boolean
  intlLabel: any
  labelAction: string
  name: string
  onChange(v: any): void
  value: string
}) => {
  const { formatMessage } = useIntl()
  const ref = useRef("")
  const [options, setOptions] = useState<IOption[]>([])

  console.log(attribute.options.apiUrl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let options
        if (attribute.options.authToken) {
          options = {
            headers: {
              Authorization: `Bearer ${attribute.options.authToken}`,
            }
          }
        }
        const response = await axios.get(attribute.options.apiUrl, options);

        console.log(response.data)
        setOptions(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [])

  return (
    <Box>
      <Field
        id={name}
        name={name}
        hint={description && formatMessage(description)}
        error={error}
      >
        <Stack spacing={1}>
          <Flex>
            <FieldLabel>{formatMessage(intlLabel)}</FieldLabel>
          </Flex>
          <Combobox value={initialValue} onChange={onChange} ref={ref} placeholder="Selecione" error={error}>
            {options.map(opt => (
              <ComboboxOption value={opt.id}>{opt.name}</ComboboxOption>
            ))}
          </Combobox>
          <FieldHint />
          <FieldError />
        </Stack>
      </Field>
    </Box>
  )
}

export default Input
