'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Globe } from 'lucide-react';

const languages = [
  { id: 'en', name: 'English' },
  { id: 'hi', name: 'हिन्दी (Hindi)' },
  { id: 'es', name: 'Español (Spanish)' },
  { id: 'fr', name: 'Français (French)' },
  { id: 'ar', name: 'العربية (Arabic)' },
  { id: 'bn', name: 'বাংলা (Bengali)' },
  { id: 'pt', name: 'Português (Portuguese)' },
  { id: 'ru', name: 'Русский (Russian)' },
  { id: 'ja', name: '日本語 (Japanese)' },
  { id: 'de', name: 'Deutsch (German)' },
  { id: 'te', name: 'తెలుగు (Telugu)' },
  { id: 'mr', name: 'मराठी (Marathi)' },
  { id: 'ta', name: 'தமிழ் (Tamil)' },
  { id: 'gu', name: 'ગુજરાતી (Gujarati)' },
];

export function LanguageSelector() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="font-headline text-white flex items-center gap-2">
          <Globe />
          Change Language
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup defaultValue="en">
          <div className="space-y-4">
            {languages.map(lang => (
              <div key={lang.id} className="flex items-center space-x-2 bg-black/20 p-4 rounded-lg border border-border">
                <RadioGroupItem value={lang.id} id={lang.id} />
                <Label htmlFor={lang.id} className="text-lg text-white font-medium cursor-pointer flex-1">{lang.name}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        <p className="text-muted-foreground text-sm mt-6">Note: Full multilingual support is currently in development. This is a visual placeholder.</p>
      </CardContent>
    </Card>
  );
}
