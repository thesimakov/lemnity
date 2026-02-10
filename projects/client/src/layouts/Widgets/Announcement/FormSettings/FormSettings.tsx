import TextSettings from '@/components/TextSettings'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import ContactAcquisitionSettings from './ContactAcquisitionSettings'
// import AgreementPoliciesField from '@/layouts/WidgetSettings/FieldsSettingsTab/AgreementPoliciesField/AgreementPoliciesField'

const FormSettings = () => {
  return (
    <div className="w-full min-w-85.5 flex flex-col gap-2.5">
      <h1 className="text-[25px] leading-7.5 font-normal text-[#060606]">
        Форма данных
      </h1>

      <BorderedContainer>
        <div className="w-full flex flex-col">
          <TextSettings
            title="Заголовок"
            placeholder="Укажите заголовок"
            noFontSize
          />
        </div>
      </BorderedContainer>

      <BorderedContainer>
        <div className="w-full flex flex-col">
          <TextSettings
            title="Описание"
            placeholder="Получите супер скидку до 30 % на покупку билета в АРТ КАФЕ."
            noFontSize
          />
        </div>
      </BorderedContainer>

      <ContactAcquisitionSettings />
      {/* <AgreementPoliciesField /> */}
    </div>
  )
}

export default FormSettings
