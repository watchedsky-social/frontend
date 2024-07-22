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
	"log"
	"strings"
)

type Frontend struct {
	//+private
	//+optional
	Registry string

	//+private
	//+optional
	ImageVersion string
}

func New(
	// The registry URL
	//+optional
	//+default="registry.lab.verysmart.house"
	registry string,
	// The image version to pull from (defaults to latest)
	//+optional
	//+default="latest"
	imageVersion string,
) *Frontend {
	return &Frontend{
		Registry:     registry,
		ImageVersion: imageVersion,
	}
}

func (f *Frontend) WithRegistry(registry string) *Frontend {
	f.Registry = registry
	return f
}

func (f *Frontend) WithImageVersion(imageVersion string) *Frontend {
	f.ImageVersion = imageVersion
	return f
}

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

func (f *Frontend) GetBuiltSite(ctx context.Context,
	//+optional
	source *dagger.Directory,
	//+optional
	eventJSON *dagger.Secret,
	//+optional
	registry string,
	//+optional
	//+default="stable"
	imageVersion string) *dagger.Directory {
	if source != nil {
		return f.Build(ctx, source, eventJSON).Directory("/site")
	} else {
		if registry == "" {
			registry = f.Registry
		}

		if imageVersion == "" {
			imageVersion = f.ImageVersion
		}

		return dag.Container().
			From(fmt.Sprintf("%s/watchedsky/frontend:%s", registry, imageVersion)).
			Directory("/site")
	}
}

func (f *Frontend) BuildAndPublish(ctx context.Context,
	source *dagger.Directory,
	registry string,
	username string,
	password *dagger.Secret,
	//+optional
	eventJSON *dagger.Secret,
) ([]string, error) {

	container := f.Build(ctx, source, eventJSON).
		WithRegistryAuth(registry, username, password)
	version, err := container.File("/tmp/version.txt").Contents(ctx)
	if err != nil {
		return nil, err
	}

	tags := []string{version, "latest"}
	if !strings.Contains(version, "-") {
		tags = append(tags, "stable")
	}

	addrs := make([]string, 0, len(tags))
	for _, tag := range tags {
		addr, err := container.Publish(ctx, fmt.Sprintf("%s/watchedsky/frontend:%s", registry, tag))
		if err != nil {
			log.Println(tag)
		}
		addrs = append(addrs, addr)
	}

	return addrs, nil
}
