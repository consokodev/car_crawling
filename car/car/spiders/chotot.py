# -*- coding: utf-8 -*-
from pprint import pprint

import scrapy
import json
import re
from scrapy.utils.project import get_project_settings
from car.items import CarItem
import time

class ChototSpider(scrapy.Spider):
    name = 'chotot'
    allowed_domains = ['https://xe.chotot.com']
    start_urls = ['https://gateway.chotot.com/v1/public/ad-listing?cg=2010&carbrand=6&carmodel=240&limit=20&st=s,k&mfdate=2013-2018',
                  'https://gateway.chotot.com/v1/public/ad-listing?region_v2=13000&cg=2010&w=1&carbrand=18&carmodel=992&limit=20&st=s,k&condition_ad=1',
                  # 'https://gateway.chotot.com/v1/public/ad-listing?region_v2=13000&cg=2010&w=1&carbrand=1&carmodel=4&limit=20&st=s,k&condition_ad=1&mfdate=2013-2019',
                  'https://gateway.chotot.com/v1/public/ad-listing?region_v2=13000&cg=2010&w=1&carbrand=3&carmodel=133&limit=20&st=s,k&condition_ad=1&mfdate=2017-2019',
                  'https://gateway.chotot.com/v1/public/ad-listing?region_v2=13000&cg=2010&w=1&carbrand=5&carmodel=187&limit=20&st=s,k&condition_ad=1&mfdate=2017-2019',
                  ]

    def parse(self, response):
        jsonRes = json.loads(response.body)
        for item in jsonRes["ads"]:
            print("################################################")
            print(item)
            print("################################################")
            desc = item["body"]
            subject = item["subject"]
            region_name = item["region_name"]
            price = item["price"]
            images = []
            images.append(item["image"])
            images = json.dumps(images)
            phone_number = ""
            address = ""
            publish_time = time.time()
            km = ""
            car_type = ""
            engine_type = ""
            org_link = self.allowed_domains[0] + '/' + str(item["list_id"]) + ".htm"
            carBrandCode = re.findall(r'carbrand=[0-9]+', response.url)[0].split("=")[1]
            car_brand = get_project_settings().get("CAR_BRAND")[carBrandCode]
            carItem = CarItem(car_brand=car_brand, km=km, car_type=car_type, engine_type=engine_type, desc=desc,
                              subject=subject, publish_time=publish_time,
                              phone_number=phone_number, address=region_name, org_link=org_link, images=images, price=price)
            yield carItem