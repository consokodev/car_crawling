# -*- coding: utf-8 -*-
import json
from urllib.parse import urljoin
import scrapy
from scrapy.utils.response import get_base_url
import re
from car.items import CarItem
import time, datetime


class BonbanhSpider(scrapy.Spider):
    name = 'bonbanh'
    allowed_domains = ['bonbanh.com']
    start_urls = [
                  # 'https://bonbanh.com/oto/kia-forte-tu-nam-2011-den-nam-2013',
                  'https://bonbanh.com/oto/honda-city-tu-nam-2013-den-nam-2017',
                  # 'https://bonbanh.com/oto/ford-escape-tu-nam-2011-den-nam-2017',
                  # 'https://bonbanh.com/oto/chevrolet-cruze-tu-nam-2011-den-nam-2017',
                  'https://bonbanh.com/oto/mitsubishi-xpander-cu-da-qua-su-dung',
                  'https://bonbanh.com/oto/ford-focus-tu-nam-2017-cu-da-qua-su-dung',
                  ]

    def parse(self, response):
        '''Parse page link'''
        urls = response.xpath('//*[@id="s-list-car"]//span[has-class("bbl")]/@url').getall()
        urls.append(response.url)
        list_urls = list(set(urls))
        # print(list_urls)
        for url in list_urls:
            if(url is not None):
                yield scrapy.Request(url, callback=self.parseCata)

    def parseCata(self, response):
        links = response.xpath('//*[@id="s-list-car"]//li[has-class("car-item")]/a/@href').getall()
        list_links = list(set(links))
        base_url = get_base_url(response)
        # print('#########')
        # print(list_links)
        for link in list_links:
            if (link is not None):
                full_link = urljoin(base_url, link)
                yield scrapy.Request(full_link, callback=self.parseItem)

    def parseItem(self, response):
        divs = response.xpath('//*[@id="mail_parent"]').getall()
        for div in divs:
            div = scrapy.Selector(text=div)
            if("Số Km đã đi:" in div.xpath('//label/text()').get()):
                km = div.xpath('//span/text()').get()
            elif ("Hộp số:" in div.xpath('//label/text()').get()):
                car_type = div.xpath('//span/text()').get()
            elif ("Động cơ:" in div.xpath('//label/text()').get()):
                engine_type = div.xpath('//span/text()').get()

        desc = (' ').join(response.xpath('//div[contains(@class,"car_des")]/div/text()').getall())
        subject = response.xpath('//div[contains(@class,"title")]/h1/text()').get()
        # convert dd/mm/yyyy to unixtime
        publish_time = time.mktime(datetime.datetime.strptime(response.xpath('//div[contains(@class,"title")]/div/text()').get().split()[2], "%d/%m/%Y").timetuple())
        divs = response.xpath('//div[contains(@class,"contact-txt")]//text()').getall()
        phone_number = ''.join(re.findall('\d+',divs[3]))
        address = divs[-1]
        images = json.dumps(response.xpath('//div[contains(@class,"highslide-gallery")]//img/@src').getall())
        car_brand = response.xpath('//*[@id="wrapper"]/div[2]/span[4]/a/span/strong//text()').get()
        org_link = response.url
        carItem = CarItem(car_brand= car_brand, km= km, car_type= car_type, engine_type= engine_type, desc= desc, subject= subject, publish_time= publish_time,
            phone_number= phone_number, address= address, org_link= org_link, images= images)
        yield carItem

        # yield {
        #     'km': km,
        #     'car_type': car_type,
        #     'engine_type': engine_type,
        #     'desc' : desc,
        #     'subject': subject,
        #     'publish_time': publish_time,
        #     'phone_number': phone_number,
        #     'address': address,
        #     'org_link' : org_link,
        #     'images': images,
        # }
