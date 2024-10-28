import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from '../../utils/pluginId';
import getTrad from '../../utils/getTrad';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.customFields.register({
      name: 'AutoComplete',
      pluginId,
      type: "string",
      intlLabel: {
        id: getTrad("form.label"),
        defaultMessage: "autocomplete",
      },
      intlDescription: {
        id: getTrad("form.description"),
        defaultMessage: "Generates a unique autocomplete",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import(/* webpackChunkName: "input-uuid-component" */ "./components/Input"),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: 'global.baseSettings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'apiUrl',
                type: 'input',
                intlLabel: {
                  id: 'form.attribute.item.apiUrl',
                  defaultMessage: 'API Url',
                },
                description: {
                  id: 'form.attribute.item.apiUrl.description',
                  defaultMessage: 'The API url to fetch options',
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'private',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.privateField',
                  defaultMessage: 'Private field',
                },
                description: {
                  id: 'form.attribute.item.privateField.description',
                  defaultMessage: 'This field will not show up in the API response',
                },
              },
            ],
          },
        ],
        validator: () => {},
      },
    });


    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
