import { RouteFormData } from 'pages'
import { State } from './index'

const requiredMessage = 'admin/pages.admin.pages.form.templates.field.required'

export const slugify = (text: string) => {
  const specialChars: { [key: string]: string } = {
    à: 'a',
    ä: 'a',
    á: 'a',
    â: 'a',
    æ: 'a',
    å: 'a',
    ë: 'e',
    è: 'e',
    é: 'e',
    ê: 'e',
    î: 'i',
    ï: 'i',
    ì: 'i',
    í: 'i',
    ò: 'o',
    ó: 'o',
    ö: 'o',
    ô: 'o',
    ø: 'o',
    ù: 'o',
    ú: 'u',
    ü: 'u',
    û: 'u',
    ñ: 'n',
    ç: 'c',
    ß: 's',
    ÿ: 'y',
    œ: 'o',
    ŕ: 'r',
    ś: 's',
    ń: 'n',
    ṕ: 'p',
    ẃ: 'w',
    ǵ: 'g',
    ǹ: 'n',
    ḿ: 'm',
    ǘ: 'u',
    ẍ: 'x',
    ź: 'z',
    ḧ: 'h',
    '·': '-',
    '/': '-',
    _: '-',
    ',': '-',
    ':': '-',
    ';': '-',
  }

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/./g, target => specialChars[target] || target) // Replace special characters using the hash map
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

const validateFalsyPath = (path: keyof RouteFormData) => (
  data: RouteFormData
) => !data[path] && { [path]: requiredMessage }

const validatePathUrl = (path: string) => {
  if (!path) return { path: requiredMessage }
  if (!path.startsWith('/'))
    return {
      path: 'admin/pages.admin.pages.form.templates.path.validation-error',
    }
  if (slugify(path) !== path.slice(1))
    return {
      path: 'admin/pages.admin.pages.form.templates.path.invalid-format',
    }

  return {}
}

export const getValidateFormState = (prevState: State) => {
  return {
    ...prevState,
    formErrors: {
      ...prevState.formErrors,
      ...(validatePathUrl(prevState.data.path) as Record<string, string>),
      ...(prevState.isInfoEditable
        ? validateFalsyPath('title')(prevState.data)
        : {}),
    },
  }
}
