import { equals } from 'ramda'
import React from 'react'
import JsonSchemaForm, { FormProps, Widget } from 'react-jsonschema-form'

import ArrayFieldTemplate from '../../../../form/ArrayFieldTemplate'
import BaseInput from '../../../../form/BaseInput'
import Dropdown from '../../../../form/Dropdown'
import ErrorListTemplate from '../../../../form/ErrorListTemplate'
import FieldTemplate from '../../../../form/FieldTemplate'
import I18nInput from '../../../../form/I18nInput'
import ImageUploader from '../../../../form/ImageUploader'
import ObjectFieldTemplate from '../../../../form/ObjectFieldTemplate'
import Radio from '../../../../form/Radio'
import RichText from '../../../../form/RichText'
import TextArea from '../../../../form/TextArea'
import Toggle from '../../../../form/Toggle'
import MediaGalleryWidget from '../../../../MediaGalleryWidget'
import { FormDataContainer } from '../../typings'

export const widgets: Record<string, Widget> = {
  BaseInput,
  CheckboxWidget: Toggle,
  IOMessage: I18nInput,
  RadioWidget: Radio,
  RichText,
  SelectWidget: Dropdown as Widget,
  TextareaWidget: TextArea,
  'image-uploader': (MediaGalleryWidget as unknown) as Widget,
}

type Props = FormProps<FormDataContainer>
export default class Form extends React.Component<Props> {
  public shouldComponentUpdate(nextProps: Props) {
    return (
      !equals(this.props.formContext, nextProps.formContext) ||
      !equals(this.props.formData, nextProps.formData)
    )
  }

  public render() {
    return (
      <JsonSchemaForm
        schema={this.props.schema}
        formData={this.props.formData}
        onChange={this.props.onChange}
        onSubmit={this.props.onSubmit}
        FieldTemplate={FieldTemplate}
        ArrayFieldTemplate={ArrayFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        uiSchema={this.props.uiSchema}
        widgets={widgets}
        showErrorList
        ErrorList={ErrorListTemplate}
        formContext={this.props.formContext}
      >
        <button className="dn" type="submit" />
      </JsonSchemaForm>
    )
  }
}
