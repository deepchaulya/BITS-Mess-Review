package com.bits.messreview.config;

import com.bits.messreview.entity.*;
import com.bits.messreview.repository.FoodItemRepository;
import com.bits.messreview.repository.OutletRepository;
import com.bits.messreview.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final OutletRepository outletRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (outletRepository.count() == 0) {
            initializeData();
        }
        if (userRepository.findByEmail("admin@pilani.bits-pilani.ac.in").isEmpty()) {
            createAdminUser();
        }
    }

    private void initializeData() {
        // Create Malviya Mess
        Outlet malviyaMess = new Outlet();
        malviyaMess.setName("Malviya Mess");
        malviyaMess.setType(OutletType.MESS);
        malviyaMess.setDescription("Main mess for students at BITS Pilani");
        malviyaMess = outletRepository.save(malviyaMess);

        // Add food items to Malviya Mess
        createFoodItem("Rajma Rasila", "Delicious kidney beans curry", malviyaMess);
        createFoodItem("Macroni Salad", "Fresh macaroni salad", malviyaMess);
        createFoodItem("Paneer Lababdar", "Rich and creamy paneer curry", malviyaMess);
        createFoodItem("Veg Kofta", "Vegetable dumplings in gravy", malviyaMess);
        createFoodItem("Madrasi Aloo", "Spicy South Indian style potatoes", malviyaMess);

        // Create Srinivasa Ramanujan Mess
        Outlet ramanujanMess = new Outlet();
        ramanujanMess.setName("Srinivasa Ramanujan Mess");
        ramanujanMess.setType(OutletType.MESS);
        ramanujanMess.setDescription("Ramanujan mess serving quality food");
        ramanujanMess = outletRepository.save(ramanujanMess);

        // Add food items to Ramanujan Mess (same items)
        createFoodItem("Rajma Rasila", "Delicious kidney beans curry", ramanujanMess);
        createFoodItem("Macroni Salad", "Fresh macaroni salad", ramanujanMess);
        createFoodItem("Paneer Lababdar", "Rich and creamy paneer curry", ramanujanMess);
        createFoodItem("Veg Kofta", "Vegetable dumplings in gravy", ramanujanMess);
        createFoodItem("Madrasi Aloo", "Spicy South Indian style potatoes", ramanujanMess);

        // Create Looters Truck Restaurant
        Outlet lootersTruck = new Outlet();
        lootersTruck.setName("Looters Truck");
        lootersTruck.setType(OutletType.RESTAURANT);
        lootersTruck.setDescription("Popular food truck near campus");
        lootersTruck = outletRepository.save(lootersTruck);

        // Add food items to Looters Truck
        createFoodItem("Chicken Pizza", "Delicious chicken pizza with fresh toppings", lootersTruck);
        createFoodItem("Chicken Popcorn", "Crispy fried chicken popcorn", lootersTruck);
        createFoodItem("Chicken Burger", "Juicy chicken burger with special sauce", lootersTruck);
        createFoodItem("Cold Coffee", "Refreshing cold coffee", lootersTruck);
        createFoodItem("Lemon Tea", "Hot lemon tea", lootersTruck);

        System.out.println("Database initialized with outlets and food items!");
    }

    private void createFoodItem(String name, String description, Outlet outlet) {
        FoodItem foodItem = new FoodItem();
        foodItem.setName(name);
        foodItem.setDescription(description);
        foodItem.setOutlet(outlet);
        foodItemRepository.save(foodItem);
    }

    private void createAdminUser() {
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("admin@pilani.bits-pilani.ac.in");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        admin.setEmailVerified(true);
        admin.setProvider("local");
        userRepository.save(admin);
        System.out.println("Admin user created! Email: admin@pilani.bits-pilani.ac.in, Password: admin123");
    }
}
