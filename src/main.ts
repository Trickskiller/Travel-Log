import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { StatusBar,Style } from '@capacitor/status-bar';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

  defineCustomElements(window);

  async function run() {
    // ...


      await StatusBar.setBackgroundColor({ color: '#FFFFFF' }); // Met la barre d'état en noir
      await StatusBar.setStyle({ style: Style.Light }); // Assure une meilleure visibilité des icônes sur la barre d'état


    // ...
  }

  run();
