import { Link } from "react-router";
import { useLanguage } from "@/i18n/context";
import { getButtonClasses } from "@/lib/button-styles";
import { ROUTES } from "@/routes/routes";

type AccountSection = "dashboard" | "profile" | "settings";

type AccountNavProps = {
  current: AccountSection;
  className?: string;
};

export function AccountNav({ current, className = "" }: AccountNavProps) {
  const { t } = useLanguage();

  const items = [
    { key: "dashboard" as const, href: ROUTES.dashboard, label: t.nav.myAccount },
    { key: "profile" as const, href: ROUTES.profile, label: t.nav.myProfile },
    { key: "settings" as const, href: ROUTES.settings, label: t.settings?.heading ?? "Settings" },
  ];

  return (
    <nav aria-label={t.nav.myAccount} className={className}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.key}
            to={item.href}
            aria-current={current === item.key ? "page" : undefined}
            className={getButtonClasses(
              current === item.key ? "primary" : "outline",
              "sm",
              "whitespace-nowrap text-center",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
