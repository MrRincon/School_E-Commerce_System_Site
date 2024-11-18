// M00774667
// Vue object with all the important functionality and information
let webstore = new Vue({
    el: '#App',
    data: {// Data information
        sitename: "SchoolFlex",
        displayPages: 0,
        lessons: [],// Array to store the lessons information
        sort: {
            by: 'Subject',
            order: 'Ascending',
            options: ['Subject', 'Location', 'Price', 'Spaces']
        },
        cart: [],// Array to store items in the shopping cart
        order: {// Order information
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            city: '',
            zip: '',
            states: {
                state: '',
                options: ['London', 'Manchester', 'Bristol', 'Cardiff']
            },
            method: 'Home',
            gift: {
                value: 'Do not send as gift',
                options: {
                    isGift: 'Send as gift',
                    isNotGift: 'Do not send as gift'
                }
            }
        }
    },
    methods: {// Methods for the application
        displayPage(page) {// Method to display an specific page
            this.displayPages = page;
        },
        addToCart(lesson) {// Method to add an item to the cart
            this.cart.push(lesson.id); 
        },
        canAddToCart(lesson) {// Method to confirm if item can be added to the cart
            return lesson.available > this.cartCount(lesson.id);
        },
        itemsLeft(lesson) {// Method to display the items left
            return lesson.available - this.cartCount(lesson.id);
        },
        cartCount(id) {// Method to count the items with the same id in the cart 
            let count = 0;
            for (let itemIndex = 0; itemIndex < this.cart.length; itemIndex++) {
                if (this.cart[itemIndex] === id) {
                    count++;
                }
            }
            return count;
        },
        removeItem(id) {// Method to remove an specific item from the cart
            let spotCount = 0;
            for ( let item of this.cart){
                if(item === id){
                    this.cart.splice(spotCount, 1);
                    break;
                }
                spotCount++;
            }
        },
        sendOrder(){// Method to send the order
            this.order
        }
    },
    computed: {// Computed methods for the application
        cartItemsCount() {// Computed method to specify if the basket is empty for the checkout button
            return this.cart.length || "";
        },
        sortedLessons() {// Computed method to sort the lessons based on the selected properties and order
            // Creates a copy of the lessons array to avoid changing the original list
            let lessonsToSort = this.lessons.slice();

            // Sort the copied lessons array based on the selected property and order
            lessonsToSort.sort((lessonA, lessonB) => {
                let valueA, valueB;
                // Using itemsLeft function if sorting by spaces available
                if (this.sort.by === 'Spaces') {
                    valueA = this.itemsLeft(lessonA);
                    valueB = this.itemsLeft(lessonB);

                } else {
                    // Get the values of the selected property from both lessons
                    valueA = lessonA[this.sort.by.toLowerCase()];
                    valueB = lessonB[this.sort.by.toLowerCase()];
                }
                // Variable for the comparison result
                let comparison;
                // Compares alphabetically if the values are strings
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    // Simple comparison, return -1 if valueA is smaller, return 1 if larger, otherwise return 0
                    comparison = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
                } else {
                    // Substracts to compare if the values are numbers
                    comparison = valueA - valueB;
                }

                // Reverses the comparison result if the order is "Descending"
                return this.sort.order === 'Ascending' ? comparison : -comparison;
            });

            // Returns the sorted array
            return lessonsToSort;
        },
        lessonsSortedLocations() {// Computed method to display the all the existent locations
            let totalLocations = [];
            this.lessons.forEach(lesson => {
                if (!totalLocations.includes(lesson.location)) {
                    totalLocations.push(lesson.location);
                }
            });
            return totalLocations.sort();
        },
        trendingLessons() {// Computed method to display the trending lessons
            let trendingLessons = this.lessons 
                .filter(lesson => this.itemsLeft(lesson) > 0)// Filtering the lessons that have more than 0
                .sort((a, b) => this.itemsLeft(a) - this.itemsLeft(b))// Sorting the lessons in ascending order
                .slice(0, 3);// Display only the first three elements
            return trendingLessons;
        },
        itemsInCart() {// Computed method to display the items in the cart
            let currItems = [];// Array for the 
            let existentItems = [];
            this.cart.forEach(item => {
                // Checking if the item is already in the new array
                if (!existentItems.includes(item)) {
                    // New data for displaying the items in the cart
                    let itemData = {
                        "img": {
                            "location": "",
                            "alt": ""
                        },
                        "price": 0.00,
                        "subject": "",
                        "location": "",
                        "id": 0,
                        "amount": 0
                    };
                    this.lessons.forEach(lesson => {
                        //Loop through the lessons to use the data of the lesson in the item in the basket
                        if (item === lesson.id) {
                            itemData.img.location = lesson.img.location;
                            itemData.img.alt = lesson.img.alt;
                            itemData.subject = lesson.subject;
                            itemData.price = lesson.price;
                            itemData.subject = lesson.subject;
                            itemData.location = lesson.location;
                            itemData.id = lesson.id;
                            itemData.amount++;
                        }
                    });
                    // Push the needed data in the array that will be displayed
                    currItems.push(itemData);
                    // Record the item in the existing items to prevent repetition
                    existentItems.push(item);
                } else {
                    currItems.forEach(itemIn => {
                        if(item === itemIn.id){
                            itemIn.amount++;// Increase the amount for repetitive items
                        }
                    })
                }
            });
            return currItems;
        }
    },
    created: function () {
        fetch("http://localhost:3000/collections/lessons").then(
            function (res) {
                res.json().then(
                    function (json) {
                        webstore.lessons = json;
                    }
                )
            }
        );
    }
});