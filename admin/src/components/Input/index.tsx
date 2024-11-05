import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'


import {
  Box,
  FieldAction,
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
  onChange(v: string): void
  value: string
}) => {
  const [options, setOptions] = useState<IOption[]>([])
  const [selectedOption, setSelectedOption] = useState('');

  function onSelected(item: string) {
    setSelectedOption(item);
  }

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

        setOptions(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [])

  return (
    <Box>
        <Stack spacing={1}>
          <Combobox value={selectedOption} placeholder="Selecione" error={error} onChange={onSelected}>
            {options.map(opt => (
              <ComboboxOption value={opt.id} key={opt.id}>{opt.name}</ComboboxOption>
            ))}
          </Combobox>
        </Stack>
    </Box>
  )
}

export default Input
