def speak(text):
    def whisper(t):
        return t.lower()
    return whisper(text)

print(speak("Hello Word"))
print(speak)
print(dir(speak))
print(dir(speak.__class__))


print("#####################")

class Test():
    def __init__(self, a, b):
        self.a = a
        self.b = b
    def getter(self):
        print(self.a)

abc = Test(1,2)
print(dir(abc))
print(dir(abc.__class__))


print("##################")

print(sorted(range(-5, 6), key=lambda x: x * x))

