%define module  themes-default
%define name    vigilo-%{module}
%define version 2.0.0
%define release 1%{?svn}%{?dist}

Name:       %{name}
Summary:    Vigilo default theme
Version:    %{version}
Release:    %{release}
Source0:    %{name}-%{version}.tar.gz
URL:        http://www.projet-vigilo.org
Group:      System/Servers
BuildRoot:  %{_tmppath}/%{name}-%{version}-%{release}-build
License:    GPLv2

BuildRequires:   python-setuptools
BuildRequires:   python-babel
BuildRequires:   python-genshi

Requires:   python >= 2.5
Requires:   python-setuptools
Requires:   vigilo-common
Requires:   python-genshi
Requires:   python-babel
######### Dependance from python dependance tree ########
Requires:   vigilo-themes-default
Requires:   vigilo-common
Requires:   python-babel
Requires:   python-genshi
Requires:   python-configobj

Requires(pre): rpm-helper

Provides:   vigilo-themes

Buildarch:  noarch


%description
This library gives an API to XMPP publication and subscription.
This library is part of the Vigilo Project <http://vigilo-project.org>

%prep
%setup -q

%build
make PYTHON=%{_bindir}/python

%install
rm -rf $RPM_BUILD_ROOT
make install \
	DESTDIR=$RPM_BUILD_ROOT \
	PREFIX=%{_prefix} \
	SYSCONFDIR=%{_sysconfdir} \
	PYTHON=%{_bindir}/python


%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(644,root,root,755)
%doc COPYING
%{python_sitelib}/*


%changelog
* Mon Feb 08 2010 Aurelien Bompard <aurelien.bompard@c-s.fr>
- initial package
