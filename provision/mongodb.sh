sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6

#echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list


sudo service mongod start


cat /var/log/mongodb/mongod.log  | grep "waiting for connections on port"


#mongoimport --db test --collection restaurants --drop --file ~/downloads/primer-dataset.json


# db.application.insert({application_id:123,keys:{secret:123,public:1234}})
# WriteResult({ "nInserted" : 1 })

# db.applications.update({test:12},{$set:{"grades":"good"},$currentDate:{"lastModified":true})

# db.restaurants.update(
#   { "restaurant_id" : "41156888" },
#   { $set: { "address.street": "East 31st Street" } }
# )

# db.restaurants.update(
#   { "address.zipcode": "10016", cuisine: "Other" },
#   {
#     $set: { cuisine: "Category To Be Determined" },
#     $currentDate: { "lastModified": true }
#   },
#   { multi: true}
# )
# db.restaurants.remove( { "borough": "Queens" }, { justOne: true } )
