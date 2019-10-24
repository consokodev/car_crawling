from redis import Redis

redis_matrix_pattern = 'test_redis'

class GoroMatrix:
    def __init__(self):
        self.type = "Goro Matrix"
        self.con_redis()
        # self.list_keys_redis()

    def list_keys_redis(self, pattern=redis_matrix_pattern):
        self.keylist = []
        for key in self.redis_con.scan_iter(pattern+'*'):
            self.keylist.append(key)

    def con_redis(self):
        self.redis_con = Redis(host='127.0.0.1', port='6379')

    def get_redis(self, key):
        jobid = self.redis_con.get(key)
        return jobid

    def set_redis(self, ticket_id, job_id, expire='1800'):
        self.redis_con.psetex(ticket_id, expire, job_id)

    def delete_redis(self, eventid):
        key = redis_matrix_pattern+eventid
        self.redis_con.delete(key)

    def matrix_check_job(self, event_id):
        key = redis_matrix_pattern+event_id
        if key in self.keylist:
            return self.get_redis(key)

goro = GoroMatrix()
goro.set_redis('test_key', "{'ticketid': '123', 'event_id': '123', 'is_done': 0}", '10000000')
result = goro.get_redis('test_key')
print(goro.get_redis('test_key'))