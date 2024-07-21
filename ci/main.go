// A generated module for Frontend functions
//
// This module has been generated via dagger init and serves as a reference to
// basic module structure as you get started with Dagger.
//
// Two functions have been pre-created. You can modify, delete, or add to them,
// as needed. They demonstrate usage of arguments and return types using simple
// echo and grep commands. The functions can be called from the dagger CLI or
// from one of the SDKs.
//
// The first line in this comment block is a short description line and the
// rest is a long description with more detail on the module's purpose or usage,
// if appropriate. All modules should have a short description.

package main

import (
	"context"
	"dagger/frontend/internal/dagger"
	"fmt"
)

type Frontend struct{}

// func (f *Frontend) PreBuildEnv(source *dagger.Directory) *dagger.Container {
// 	return dag.Container()
// }

func (f *Frontend) BuildEnv(ctx context.Context, source *dagger.Directory, eventJSON *dagger.Secret) *dagger.Container {
	container := dag.Container().
		From("cgr.dev/chainguard/node-lts:latest-dev").
		WithUser("root").
		WithFiles("/ci/scripts", []*dagger.File{
			source.File("ci/scripts/prepare.sh"),
			source.File("ci/scripts/version.cjs"),
		}).
		WithDirectory("/src", source).
		WithEnvVariable("CI", "true")

	if eventJSON != nil {
		json, err := eventJSON.Plaintext(ctx)
		if err == nil {
			container = container.WithEnvVariable("EVENT_JSON", json)
		}
	}

	return container.
		WithWorkdir("/src").
		WithExec([]string{"/ci/scripts/version.cjs"}).
		WithExec([]string{"/ci/scripts/prepare.sh"})
}

func (f *Frontend) Build(ctx context.Context, source *dagger.Directory, eventJSON *dagger.Secret) *dagger.Container {
	buildEnv := f.BuildEnv(ctx, source, eventJSON)

	versionFile := buildEnv.File("/tmp/version.txt")

	builtDir := buildEnv.
		WithExec([]string{"pnpm", "run", "build"}).
		Directory("/src/dist")

	return dag.Container().
		From("gcr.io/distroless/base").
		WithFile("/tmp/version.txt", versionFile).
		WithDirectory("/site", builtDir)
}

func (f *Frontend) BuildAndPublish(ctx context.Context,
	source *dagger.Directory,
	registry string,
	username string,
	password *dagger.Secret,
	//+optional
	eventJSON *dagger.Secret,
) (string, error) {

	container := f.Build(ctx, source, eventJSON)
	version, err := container.File("/tmp/version.txt").Contents(ctx)
	if err != nil {
		return "", err
	}

	return container.
		WithRegistryAuth(registry, username, password).
		Publish(ctx, fmt.Sprintf("%s/watchedsky/frontend:%s", registry, version))
}
