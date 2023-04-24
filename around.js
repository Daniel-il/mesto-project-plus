function getI18nText({ stringTokens, variables, translations, locale }) {
    const [keys, variablesObj, translationsObj] = translations;
    const transObj = translationsObj[locale];
  
    const intlVars = {};
    Object.keys(variablesObj).forEach((key) => {
      const varName = variablesObj[key];
      intlVars[varName] = variables[varName];
    });
  
    const formatter = new Intl.MessageFormat(transObj.translation, locale);
    const formattedMessage = formatter.format(intlVars);
  
    const result = keys.reduce((acc, key, i) => {
      let value = key;
      if (key.startsWith("$")) {
        const varName = variablesObj[key];
        value = variables[varName];
      } else if (key.startsWith("#")) {
        value = formattedMessage;
      }
      acc += `${value} `;
      return acc;
    }, "");
  
    return result.trim();
  }
  console.log(getI18nText( ["key", " ", "$var", " ", "#translation"],
  { var: 100 },
  {
      "ru-RU": { translation: "тест" },
      "en-US": { translation: "test" },
      "de-DE": { translation: "prüfen" },
      "hi-IN": { translation: "परीक्षा" },
      "ar-AA": { translation: "امتحان" },
  },))