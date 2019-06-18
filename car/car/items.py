# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class CarItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    desc = scrapy.Field()
    subject = scrapy.Field()
    region_name = scrapy.Field()
    price = scrapy.Field()
    images = scrapy.Field()
    phone_number = scrapy.Field()
    address = scrapy.Field()
    publish_time = scrapy.Field()
    km = scrapy.Field()
    car_type = scrapy.Field()
    engine_type = scrapy.Field()
    org_link = scrapy.Field()
    car_brand = scrapy.Field()