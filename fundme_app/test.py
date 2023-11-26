def recursive(n,x=1):
    print(x)
    if x==n:
        return None
    return recursive(n,x+1)
recursive(5)