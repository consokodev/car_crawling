def dis_patch(operator,x,y):
    return {
        "add": lambda: x + y,
        "minus": lambda: x - y,
    }.get(operator, lambda: None)

print(dis_patch("add", 1 , 2)())
print(dis_patch("no", 2 ,3)())