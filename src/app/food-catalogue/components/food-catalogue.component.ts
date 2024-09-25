import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FoodItemService } from '../service/fooditem.service';
import { FoodCataloguePage } from 'src/app/shared/models/FoodCataloguePage';
import { FoodItem } from 'src/app/shared/models/FoodItem';


@Component({
  selector: 'app-food-catalogue',
  templateUrl: './food-catalogue.component.html',
  styleUrl: './food-catalogue.component.css'
})
export class FoodCatalogueComponent {

  restaurantId: number;
  foodItemResponse: FoodCataloguePage;
  foodItemCart: FoodItem[] =[];
  orderSummary: FoodCataloguePage;

  constructor(private route: ActivatedRoute, private foodItemService: FoodItemService, private router: Router){

  }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.restaurantId = +params.get('id');
    });

    this.getFoodItemsByRestaurant(this.restaurantId);

  }

  getFoodItemsByRestaurant(restaurant: number) {
    this.foodItemService.getFoodItemsByRestaurant(this.restaurantId).subscribe(
      data => {
        this.foodItemResponse = data;
      }
    )
  }

  increment(food: any) {
    food.quantity++;
    const index = this.foodItemCart.findIndex(item => item.id === food.id);
    if (index === -1) {
      this.foodItemCart.push(food);
    } else {
      this.foodItemCart[index] = food;
    }
  }

  decrement(food: any){
    if(food.quantity > 0) {
      food.quantity--;

      const index = this.foodItemCart.findIndex(item => item.id === food.id);
      if (this.foodItemCart[index].quantity ==0) {
        this.foodItemCart.splice(index, 1);
      } else {
        this.foodItemCart[index] = food;
      }
    }
  }

  onCheckOut() {
    this.foodItemCart;
    this.orderSummary = {
      foodItemsList: [],
      restaurant: null
    }
    this.orderSummary.foodItemsList = this.foodItemCart;
    this.orderSummary.restaurant = this.foodItemResponse.restaurant;
    this.router.navigate(['/orderSummary'], { queryParams: { data: JSON.stringify(this.orderSummary)}});
  }

}
