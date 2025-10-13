import SwitchableField from '@/components/SwitchableField'
import { Input, Textarea } from '@heroui/input'
import { useState } from 'react'

const AgreementPoliciesField = () => {
  const [enabled, setEnabled] = useState(true)

  return (
    <SwitchableField title="Согласие и политика" enabled={enabled} onToggle={setEnabled}>
      <div className="flex flex-col gap-3">
        <Textarea
          radius="sm"
          variant="bordered"
          minRows={2}
          placeholder="Я даю согласие на обработку моих персональных данных ООО Компания (ИНН 0000000000) в целях обработки заявки и обратной связи. Политика конфиденциальности по ссылке."
          className="max-w-full"
          classNames={{
            input: 'placeholder:text-[#AFAFAF]'
          }}
        />
        <span className="text-lg font-normal">URL политики обработки персональных данных</span>
      </div>
      <Input
        radius="sm"
        variant="bordered"
        placeholder="lemnity.ru/policy"
        className="max-w-full"
        classNames={{
          input: 'placeholder:text-[#AFAFAF]'
        }}
      />
    </SwitchableField>
  )
}

export default AgreementPoliciesField
