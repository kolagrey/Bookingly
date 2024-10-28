import { Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialLinksProps {
  disabled: boolean;
  values: {
    portfolio_url?: string;
    linkedin_url?: string;
    twitter_handle?: string;
    instagram_handle?: string;
  };
  onChange: (key: string, value: string) => void;
}

export function SocialLinks({ values, onChange, disabled }: SocialLinksProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Portfolio Website</Label>
        <Input
          disabled={disabled}
          type="url"
          placeholder="https://your-website.com"
          value={values.portfolio_url || ""}
          onChange={(e) => onChange("portfolio_url", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>LinkedIn Profile</Label>
        <Input
          disabled={disabled}
          type="url"
          placeholder="https://linkedin.com/in/username"
          value={values.linkedin_url || ""}
          onChange={(e) => onChange("linkedin_url", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>X (Twitter) Handle</Label>
        <Input
          disabled={disabled}
          placeholder="@username"
          value={values.twitter_handle || ""}
          onChange={(e) => onChange("twitter_handle", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Instagram Handle</Label>
        <Input
          disabled={disabled}
          placeholder="@username"
          value={values.instagram_handle || ""}
          onChange={(e) => onChange("instagram_handle", e.target.value)}
        />
      </div>
    </div>
  );
}
