class Test:
    def testReMe(self):
        print(f'Class {self}')
    @classmethod
    def testClsMe(cls):
        print(f'Class {cls}')
    @staticmethod
    def testStaMe():
        print(f'Class')
abc = Test()
abc.testReMe()
abc.testClsMe()
abc.testStaMe()