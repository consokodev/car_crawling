# -*- coding: utf-8 -*-
import logging
from rest_framework.response import Response as RestResponse
import six, json



class ResponseAPI():
    """
    Tạo class response giúp over write response format của api

    OrderedDict([
                    'status': 200,
                    'data': OrderedDict([{
                        'response_code': 0,
                        'response_message': 'dddd',
                        'response_data': OrderedDict([{
                        }])
                    }]),
                    'content_type': 'application/json'
                    ])

    """

    logger = logging.getLogger(__name__)

    def __init__(self, response_code, response_message, response_data, *args):

        self.response_code = response_code
        self.response_message = response_message

        try:
            # load json
            self.response_data = json.loads(response_data)
        except:
            # load string
            self.response_data = response_data

        if len(args) > 0 and isinstance(args[0], six.integer_types):
            self.status = args[0]
        else:
            self.status = 200

    def _asdict(self):

        response = dict()

        response["status"] = self.status
        response["content_type"] = "application/json"
        response["data"] = dict()

        response["data"]["response_code"] = self.response_code
        response["data"]["response_message"] = self.response_message
        response["data"]["response_data"] = self.response_data

        return response

    # trả về response JSON String
    @property
    def resp(self):
        return RestResponse(**self._asdict())

    # Trả về response là đối tượng DICT
    @property
    def resp_dict(self):
        return self._asdict()