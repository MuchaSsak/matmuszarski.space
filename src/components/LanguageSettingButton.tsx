import { useLingui } from "@lingui/react/macro";

import { type AvailableButtonVariants, Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { useLanguage } from "@/contexts/LanguageContext";
import { AVAILABLE_LANGUAGES } from "@/lib/languages";
import { cn } from "@/lib/utils";

type LanguageSettingButtonProps = {
  buttonClassName?: string;
  buttonVariant?: AvailableButtonVariants;
  buttonText?: string;
  sideOffset?: number;
  tabIndex?: number;
};

function LanguageSettingButton({
  buttonClassName,
  buttonVariant = "secondary",
  buttonText,
  sideOffset,
  tabIndex,
}: LanguageSettingButtonProps) {
  const { t } = useLingui();
  const { language, setLanguage } = useLanguage();

  return (
    <Combobox
      value={language}
      setValue={setLanguage}
      items={AVAILABLE_LANGUAGES}
      iconClassName="font-emoji"
      placeholderLabel={t`language`}
      align="start"
      sideOffset={sideOffset}
    >
      <Button
        variant={buttonVariant}
        role="combobox"
        size="icon"
        className={cn("font-emoji", buttonClassName)}
        tabIndex={tabIndex}
      >
        {
          AVAILABLE_LANGUAGES.find(
            (availableLanguage) => availableLanguage.value === language
          )!.Icon
        }
        {buttonText && <span>{buttonText}</span>}
      </Button>
    </Combobox>
  );
}

export default LanguageSettingButton;
