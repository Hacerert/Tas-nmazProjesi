import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tasinmazFrontend';

  export(type: 'excel' | 'pdf') {
    // Burada gerçek export işlemi yapılacak
    console.log(`${type.toUpperCase()} aktarımı başlatıldı.`);
  }
}
