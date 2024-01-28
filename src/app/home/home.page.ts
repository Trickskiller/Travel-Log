import { Component, OnInit } from '@angular/core';
import { register } from "swiper/element/bundle"
import { NavController, Platform } from '@ionic/angular';

register();
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(    private navCtrl: NavController,
    private platform: Platform) {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(10, () => {
        window.location.reload();
      });
    })
  }
  ngOnInit(): void {  }

}
