### git commands
Every time when you try to make a change, you need to generate & change your branch as follows.
```shell
$ git clone <..the address..>
$ git branch // check the current branch(es)
	* master
$ git branch sub1  // generate a branch "sub1"(random name)
$ git checkout sub1 // move to sub1 branch
$ git branch // check again
	master
	* sub1 // * means the current branch

// ... you make changes here ...
$ git add <files you have changed this time>
$ git commit -m "some messages"
$ git push origin sub1 // push your codes to remote repository

// Now you can check that your branch is uploaded on the Github

```
