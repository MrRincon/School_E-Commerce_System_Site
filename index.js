// M00774667
// Vue object with all the important functionality and information
let webstore = new Vue({
    el: '#App',
    data: {//Product information
        sitename: "SchoolFlex",
        displayPages: 0,
        lessons: [],
        sort: {
            by: 'Subject',
            order: 'Ascending',
            options: ['Subject', 'Location', 'Price', 'Spaces']
        },
        cart: [],//Array to store items in the shopping cart [1001,1001,1001]
        
    },
    methods: {
        displayPage(page) {
            this.displayPages = page;
        },
        addToCart(lesson) {
            this.cart.push(lesson.id);//Add item to cart 
        },
        canAddToCart(lesson) {
            return lesson.available > this.cartCount(lesson.id);
        },
        itemsLeft(lesson) {
            return lesson.available - this.cartCount(lesson.id);
        },
        cartCount(id) {
            let count = 0;
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i] === id) {
                    count++;
                }
            }
            return count;
        },
        submitDeliveryDetails() {
            alert('Order submitted!');
        },
        removeItem(id) {
            let spotCount = 0;
            for ( let item of this.cart){
                if(item === id){
                    this.cart.splice(spotCount, 1);
                    break;
                }
                spotCount++;
            }
        },
        sendOrder(){
            this.order
        }
    },
    computed: {
        basketAmount() {
            if (this.cart.length > 0) {
                return true;
            } else {
                return false;
            }
        },
        cartItemsCount() {
            return this.cart.length || "";
        },
        lessonsSortedLocations() {
            let totalLocations = [];
            this.lessons.forEach(lesson => {
                if (!totalLocations.includes(lesson.location)) {
                    totalLocations.push(lesson.location);
                }
            });
            return totalLocations.sort();
        },
        trendingLessons() {
            let trendingLessons = this.lessons
                .filter(lesson => this.itemsLeft(lesson) > 0)
                .sort((a, b) => this.itemsLeft(a) - this.itemsLeft(b))
                .slice(0, 3);
            return trendingLessons;
        },
        
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