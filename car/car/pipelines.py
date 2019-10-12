# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo
from car.items import CarItem

class CarPipeline(object):
    collection_name = 'front_caritem'

    def __init__(self, mongo_uri, mongo_db, mongo_user, mongo_pass):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db
        self.mongo_user = mongo_user
        self.mongo_pass = mongo_pass


    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_uri = crawler.settings.get('MONGO_URI'),
            mongo_db = crawler.settings.get('MONGO_DATABASE'),
            mongo_user = crawler.settings.get('MONGO_USER'),
            mongo_pass = crawler.settings.get('MONGO_PASS')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri, username=self.mongo_user, password=self.mongo_pass)
        self.db = self.client[self.mongo_db]
        idx = pymongo.IndexModel([('org_link', pymongo.ASCENDING)], unique=True)
        self.db[self.collection_name].create_indexes([idx])

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        print('######################################')
        print('Mongodb item: ', item)
        if(isinstance(item, CarItem)):
            try:
                self.db[self.collection_name].insert_one(dict(item))
            except Exception:
                pass
        return item