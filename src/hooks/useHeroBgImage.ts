import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type HeroBgKey =
  | 'hero_bg_about'
  | 'hero_bg_give'
  | 'hero_bg_news'
  | 'hero_bg_library'
  | 'hero_bg_testimonials'
  | 'hero_bg_impact'
  | 'hero_bg_word';

const useHeroBgImage = (key: HeroBgKey): string => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    supabase
      .from('site_content')
      .select('content_value')
      .eq('content_key', key)
      .maybeSingle()
      .then(({ data }) => { if (data?.content_value) setUrl(data.content_value); });
  }, [key]);
  return url;
};

export default useHeroBgImage;
