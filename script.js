const fryndrApp = {} 
fryndrApp.api = "43ff2d89ca6003d127a6b6a09eca135f";

fryndrApp.getLocation = function (searchTerm) {
    $.ajax ({
        url: "https://developers.zomato.com/api/v2.1/locations",
        method: "GET",
        dataType: "json",
        headers: {
            "user-key": fryndrApp.api
        },
        data: {
            "query": searchTerm
        }
    }).then(function (data) {
        fryndrApp.findFries(data.location_suggestions[0].city_id);
    }).catch(function (err) {
        console.log(err);
        alert(`Sorry! We can't find any hot fries for you right now. We are working on fixing the issue!`);
    })
}

fryndrApp.findFries = function (city) {
    $.ajax ({
        url: "https://developers.zomato.com/api/v2.1/search",
        method: "GET",
        dataType: "json",
        headers: {
            "user-key": fryndrApp.api
        },
        data: {
            "entity_id": city,
            "entity_type": "city",
            "q": "fries"
        }
    }).then(function (res) {
        fryndrApp.showFries(res);
    })
}

fryndrApp.showFries = function (restoList) {
    restoList.restaurants.forEach(function (restaurant) {
        const resName = restaurant.restaurant.name;
        const resLocation = restaurant.restaurant.location.address;
        const resUrl = restaurant.restaurant.url;
        const resImage = restaurant.restaurant.thumb || "./assets/pug-fries-stock.jpg"; //image 
        const resRating = restaurant.restaurant.user_rating.aggregate_rating;
        const htmlToAppend = `
        <div class="search-results">
            <a href="${resUrl} alt="link to restaurant page>
                <div class="results-info">
                    <img src="${resImage}" alt="image of food provided by the restaurant">    
                    <h2 class="restaurant-name">${resName}, ${resRating}</h2>
                    <p><i class="fas fa-map-marker-alt"></i> ${resLocation}</p>
                </div>
                <div class="overlay">
                    <p><i class="fas fa-arrow-circle-right"></i></p>
                </div>
            </a>
        </div>
        `;
        $('.results-container').append(htmlToAppend);
    });

}

fryndrApp.init = () => {
    $('form').submit(function(e) {
        e.preventDefault();
        const searchTerm = $('#search-location').val();
        fryndrApp.getLocation(searchTerm);
        $('.results-container').empty();
    })
};

$(function () {
    fryndrApp.init();
});

