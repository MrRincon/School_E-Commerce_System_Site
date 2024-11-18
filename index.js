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
        order: {
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
        trendingLessons() {
            let trendingLessons = this.lessons
                .filter(lesson => this.itemsLeft(lesson) > 0)
                .sort((a, b) => this.itemsLeft(a) - this.itemsLeft(b))
                .slice(0, 3);
            return trendingLessons;
        },
        itemsInCart() {
            let currItems = [];
            let existentItems = [];
            this.cart.forEach(item => {
                if (!existentItems.includes(item)) {
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
                    currItems.push(itemData);
                    existentItems.push(item);
                } else {
                    currItems.forEach(itemIn => {
                        if(item === itemIn.id){
                            itemIn.amount++;
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