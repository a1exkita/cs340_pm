# 🚀 Git Commands Tips
## Fork and Merge a Branch
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

	// ... you make changes here ... then
	$ git add <files you have changed this time>
	$ git commit -m "some messages"
	$ git push origin sub1 // push your codes to remote repository

	// Now you can check that your branch is uploaded on the Github

	// When you want to merge sub1 to master branch,
	$ git checkout master
	$ git merge sub1

```
## Check and Edit Other Member's Branch
Suppose that you are in master branch now and you want to check sub2.
```shell
	$ git checkout sub2
	$ git pull
	
	// then you can check that your local directory is changed into the "sub2" state.
	$ ls
	// Now you can edit codes for helping "sub2" branch as usual.
	$ git add <files you have changed this time>
	$ git commit -m "some messages"
	$ git push origin sub2 // push your codes to remote repository
```

## In Case that You Changed Mater Branch Accidently
Suppose that you changed your local files on master branch, but you did not add or commit them.
```shell
	// first check your status on master branch
	// you can see your modified but unstaged (=not added) files
	$ git status
	
	// When you assume that your files are not staged yet,
	$ git checkout -- <your accidently modified local files>

	// Your changes should be gone
```
## The State Terms on Your Local Repository
*untracked: The file is new, Git knows nothing about it. If you git add <file>, it becomes:
*staged: Now Git knows the file (tracked), but also made it part of the next commit batch (called the index). If you git commit, it becomes:
*unchanged: The file has not changed since its last commit. If you modify it, it becomes:
*unstaged: Modified but not part of the next commit yet. You can stage it again with git add
	
