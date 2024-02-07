import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './services/weather.service';
import { MatCardModule } from "@angular/material/card"
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatSnackBar,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ 
    CommonModule, 
    RouterOutlet, 
    HttpClientModule, 
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'weather-app'; 
  public temperature?: number;
  public minTemp?: number;
  public maxTemp?: number;
  weather: any;
  backgroundStyle: any;
  city: string = "";
  public localTime?: string;
  favorite: {name: string, isFav: boolean}[] = [];

  isFav = false;
  


  constructor(private weatherService: WeatherService, private _snackBar: MatSnackBar){}

  ngOnInit(): void {
    this.loadFavorites();
    this.getWeather('Tokyo');
  }

  saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(this.favorite));
  }

  loadFavorites() {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      this.favorite = JSON.parse(favorites);
      this.checkIsFav(this.city);
    }
  }

  getWeather(city: string): void{
    this.weatherService.getWeather(city).subscribe({
      next: (data) => {
        
        this.weather = data; 
        this.temperature = Math.round(data.main.temp);
        this.minTemp = Math.round(data.main.temp_min);
        this.maxTemp = Math.round(data.main.temp_max);
        const weatherCondition = data.weather[0].main;
        this.updateBackground(weatherCondition);
        console.log('weather data:', data);
        this.checkIsFav(city);
      },
      error: (error) => console.error('there was an error!', error)
    });
  }

  updateCity(city: string){
    this.city = city;
    this.getWeather(this.city);
  }

  onFavoriteToggle(city: string){
    const cityIndex = this.favorite.findIndex(fav => fav.name.toLowerCase() === city.toLowerCase());
    
    let snackBarMessage = "";

    if (cityIndex === -1) {
      // Add city as favorite if not found
      this.favorite.push({name: city, isFav: true});
      snackBarMessage = `${city} added to favorites!`;
      
    } else {
      // Remove city from favorites if already present
      this.favorite.splice(cityIndex, 1);
      snackBarMessage = `${city} removed from favorites!`;
    }

    // Update isFav based on the current city's favorite status
    this.checkIsFav(city);

    this._snackBar.open(snackBarMessage, 'Close', {
      duration: 1000, // Duration in milliseconds after which the snackbar will disappear
    });

    this.saveFavorites();
  }

  checkIsFav(city: string) {
    const cityObj = this.favorite.find(fav => fav.name.toLowerCase() === city.toLowerCase());
    this.isFav = !!cityObj; // isFav is true if cityObj is not undefined
  }
  

  updateBackground(weatherCondition: string){
    const baseUrl = "assets/";
    let imageName = 'neutral.gif';

    switch (weatherCondition){
      case 'Clouds':
        imageName = 'cloud.gif';
        break;
      case 'Clear':
        imageName = 'day.gif';
        break;
      case 'Rain':
      case 'Drizzle':
        imageName = 'rain.gif';
        break;
      case 'Snow':
        imageName = "snow.gif";
        break;
    }

    this.backgroundStyle = {'background-image' : `url(${baseUrl + imageName})`};
  }

}
