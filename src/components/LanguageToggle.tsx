
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleLanguage}
      className="rounded-full w-10 h-10 bg-white dark:bg-slate-800 border-primary/20 shadow-md hover:bg-primary/10 ml-2"
      aria-label={language === "ar" ? "English" : "العربية"}
    >
      <Globe className="h-5 w-5 text-primary" />
      <span className="sr-only">{language === "ar" ? "English" : "العربية"}</span>
    </Button>
  );
}
