"""
import sys

print("Hello")
"""
from github import Github
from firebase import firebase
import json
import sys
firebase = firebase.FirebaseApplication('https://github-api-5f6b3.firebaseio.com', None)

lines = [line.rstrip('\n') for line in open('cred.txt')]

g = Github(lines[0])

u = g.get_user(sys.argv[1])
f = open("file.txt", "a")
f.write(u.login)
print(u.login)
i=0
s = 0
commits = 0

result = firebase.delete('/followers', '')

for r in u.get_repos():
    s = s + r.size
    i = i+1
    for c in r.get_stats_contributors():
        if(c.author.login == u.login):
            commits += c.total
s = s/i
commits = commits/i
data = {'size': s, 'avg commits': commits}
result = firebase.put('', '/user', data)

followers = u.get_followers()

for f in followers:
    name = f.login
    path = '/followers/' + name
    i=0
    s = 0
    commits = 0
    canGet = False
    for r in f.get_repos():
        s = s + r.size
        i = i+1
        if r.get_stats_contributors() is not None:
            canGet = True
            for c in r.get_stats_contributors():
                if(c.author.login == f.login):
                    commits += c.total
    if canGet is True:
        s = s/i
        commits = commits/i
        data = {'size': s, 'avg commits': commits}
        result = firebase.put('', path, data)
