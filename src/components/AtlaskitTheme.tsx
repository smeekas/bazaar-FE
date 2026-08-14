import { getThemeHtmlAttrs } from '@atlaskit/tokens/get-theme-html-attrs';
import { getThemeStyles } from '@atlaskit/tokens/get-theme-styles';

/**
 * Design system theme used across the app.
 * Switching `colorMode` to `'auto'` additionally requires the pre-paint script from
 * `@atlaskit/tokens/get-ssr-auto-script` to avoid a flash of the wrong theme.
 */
const THEME = {
  colorMode: 'light',
  light: 'light',
  shape: 'shape',
  spacing: 'spacing',
  typography: 'typography',
} as const;

/** Tells the design system which token set to resolve. Spread onto `<html>`. */
export const themeHtmlAttrs = getThemeHtmlAttrs(THEME);

/**
 * Design token stylesheets, resolved on the server so the first paint is already
 * themed. React hoists the tags into the document head.
 */
export async function AtlaskitThemeStyles() {
  const themes = await getThemeStyles(THEME);

  return (
    <>
      {themes.map(({ id, attrs, css }) => (
        <style key={id} {...attrs} href={`atlaskit-theme-${id}`} precedence="high">
          {css}
        </style>
      ))}
    </>
  );
}
