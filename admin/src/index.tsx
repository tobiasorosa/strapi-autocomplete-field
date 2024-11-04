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
        defaultMessage: "AutoComplete",
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
            intlLabel: {
              id: 'autocomplete.apiUrl.label',
              defaultMessage: 'API Url',
            },
            description: {
              id: 'autocomplete.apiUrl.description',
              defaultMessage: "Endpoint to fetch the options",
            },
            name: 'options.apiUrl',
            type: 'text',
          },
          {
            intlLabel: {
              id: 'autocomplete.authToken.label',
              defaultMessage: 'Auth Token',
            },
            description: {
              id: 'autocomplete.authToken.description',
              defaultMessage: "Bearer Authorization Token if needed for the endpoint call",
            },
            name: 'options.authToken',
            type: 'text',
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
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id:  'ckeditor.required.label',
                  defaultMessage: 'Required field',
                },
                description: {
                  id:  'ckeditor.required.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
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
