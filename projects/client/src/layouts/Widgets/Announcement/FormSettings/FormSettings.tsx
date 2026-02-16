import { useShallow } from 'zustand/react/shallow'

import useWidgetSettingsStore from '@/stores/widgetSettingsStore'

import TextSettings from '@/components/TextSettings'
import BorderedContainer from '@/layouts/BorderedContainer/BorderedContainer'
import ContactAcquisitionSettings from './ContactAcquisitionSettings'
import AgreementAndPolicy from '@/components/AgreementAndPolicy'

import type {
  AnnouncementWidget,
} from '@lemnity/widget-config/widgets/announcement'
import { announcementWidgetDefaults } from '../defaults'

const FormSettings = () => {
  const {
    title,
    titleFontColor,
    description,
    descriptionFontColor,

    contactAcquisitionEnabled,
    nameFieldEnabled,
    nameFieldRequired,
    emailFieldEnabled,
    emailFieldRequired,
    phoneFieldEnabled,
    phoneFieldRequired,

    agreement,
    adsInfo,
  } = useWidgetSettingsStore(
    useShallow(s => {
      // a crutch because the store just works this way apparently
      const settings = (s.settings?.widget as AnnouncementWidget).formSettings
      return {
        title: settings?.title,
        titleFontColor: settings?.titleFontColor,
        description: settings?.description,
        descriptionFontColor: settings?.descriptionFontColor,

        contactAcquisitionEnabled: settings?.contactAcquisitionEnabled,
        nameFieldEnabled: settings?.nameFieldEnabled,
        nameFieldRequired: settings?.nameFieldRequired,
        emailFieldEnabled: settings?.emailFieldEnabled,
        emailFieldRequired: settings?.emailFieldRequired,
        phoneFieldEnabled: settings?.phoneFieldEnabled,
        phoneFieldRequired: settings?.phoneFieldRequired,

        agreement: settings?.agreement,
        adsInfo: settings?.adsInfo,
      }
    })
  )

  // mmm, yes, boilerplate
  const setFormScreenTitle = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenTitle
  )
  const setFormScreenTitleFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenTitleFontColor
  )
  const setFormScreenDescription = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenDescription
  )
  const setFormScreenDescriptionFontColor = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenDescriptionFontColor
  )

  const setFormScreenContactAcquisitionEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenContactAcquisitionEnabled
  )
  const setFormScreenNameFieldEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenNameFieldEnabled
  )
  const setFormScreenNameFieldRequired = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenNameFieldRequired
  )
  const setFormScreenEmailFieldEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenEmailFieldEnabled
  )
  const setFormScreenEmailFieldRequired = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenEmailFieldRequired
  )
  const setFormScreenPhoneFieldEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenPhoneFieldEnabled
  )
  const setFormScreenPhoneFieldRequired = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenPhoneFieldRequired
  )

  const setAgreementEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenAgreementEnabled
  )
  const setAgreementPolicyUrl = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenAgreementPolicyUrl
  )
  const setAgreementUrl = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenAgreementUrl
  )
  const setAgreementColor = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenAgreementColor
  )

  const setAdsInfoEnabled = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenAdsInfoEnabled
  )
  const setAdsInfoPolicyUrl = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenAdsInfoPolicyUrl
  )
  const setAdsInfoColor = useWidgetSettingsStore(
    s => s.setAnnouncementFormScreenAdsInfoColor
  )

  return (
    <div className="w-full min-w-85.5 flex flex-col gap-2.5">
      <h1 className="text-[25px] leading-7.5 font-normal text-[#060606]">
        Форма данных
      </h1>

      <BorderedContainer>
        <div className="w-full flex flex-col">
          <TextSettings
            title="Заголовок"
            text={
              title
              ?? announcementWidgetDefaults.formSettings!.title
            }
            onTextChange={setFormScreenTitle}
            textColor={
              titleFontColor
              ?? announcementWidgetDefaults.formSettings!.titleFontColor
            }
            onColorChange={setFormScreenTitleFontColor}
            placeholder="Укажите заголовок"
          />
        </div>
      </BorderedContainer>

      <BorderedContainer>
        <div className="w-full flex flex-col">
          <TextSettings
            title="Описание"
            text={
              description
              ?? announcementWidgetDefaults.formSettings!.description
            }
            onTextChange={setFormScreenDescription}
            textColor={
              descriptionFontColor
              ?? announcementWidgetDefaults.formSettings!.descriptionFontColor
            }
            onColorChange={setFormScreenDescriptionFontColor}
            placeholder={
              "Получите супер скидку до 30 % на покупку билета в АРТ КАФЕ."
            }
          />
        </div>
      </BorderedContainer>

      <ContactAcquisitionSettings
        contactAcquisitionEnabled={!!contactAcquisitionEnabled}
        onContactAcquisitionToggle={setFormScreenContactAcquisitionEnabled}
        nameFieldEnabled={
          nameFieldEnabled
          ?? announcementWidgetDefaults.formSettings!.nameFieldEnabled
        }
        onNameFieldEnabledChange={setFormScreenNameFieldEnabled}
        nameFieldRequired={
          nameFieldRequired
          ?? announcementWidgetDefaults.formSettings!.nameFieldRequired
        }
        onNameFieldRequiredChange={setFormScreenNameFieldRequired}
        phoneFieldEnabled={
          phoneFieldEnabled
          ?? announcementWidgetDefaults.formSettings!.phoneFieldEnabled
        }
        onPhoneFieldEnabledChange={setFormScreenPhoneFieldEnabled}
        phoneFieldRequired={
          phoneFieldRequired
          ?? announcementWidgetDefaults.formSettings!.phoneFieldRequired
        }
        onPhoneFieldRequiredChange={setFormScreenPhoneFieldRequired}
        emailFieldEnabled={
          emailFieldEnabled
          ?? announcementWidgetDefaults.formSettings!.emailFieldEnabled
        }
        onEmailFieldEnabledChange={setFormScreenEmailFieldEnabled}
        emailFieldRequired={
          emailFieldRequired
          ?? announcementWidgetDefaults.formSettings!.emailFieldRequired
        }
        onEmailFieldRequiredChange={setFormScreenEmailFieldRequired}
      />
      
      <AgreementAndPolicy
        errorPath=''
        agreement={
          agreement
          ?? announcementWidgetDefaults.formSettings!.agreement
        }
        onToggle={setAgreementEnabled}
        onFontColorChange={setAgreementColor}
        onAgreementUrlChange={setAgreementUrl}
        onPolicyUrlChange={setAgreementPolicyUrl}
      />
      
      <AgreementAndPolicy
        errorPath=''
        agreement={
          adsInfo
          ?? announcementWidgetDefaults.formSettings!.adsInfo
        }
        onToggle={setAdsInfoEnabled}
        onFontColorChange={setAdsInfoColor}
        onPolicyUrlChange={setAdsInfoPolicyUrl}
      />
    </div>
  )
}

export default FormSettings
